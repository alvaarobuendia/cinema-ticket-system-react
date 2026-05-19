using CinemaTicketSystem.Api.DTOs.Auth;
using CinemaTicketSystem.Api.Models;
using CinemaTicketSystem.Api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CinemaTicketSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser>
        _userManager;

    private readonly SignInManager<ApplicationUser>
        _signInManager;

    private readonly JwtService _jwtService;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        JwtService jwtService
    )
    {
        _userManager = userManager;

        _signInManager = signInManager;

        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        RegisterDto dto
    )
    {
        var existingUser =
            await _userManager.FindByEmailAsync(
                dto.Email
            );

        if (existingUser != null)
        {
            return BadRequest(
                new
                {
                    message =
                        "Email already exists"
                }
            );
        }

        var user = new ApplicationUser
        {
            UserName = dto.Email,
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            PhoneNumber = dto.PhoneNumber
        };

        var result =
            await _userManager.CreateAsync(
                user,
                dto.Password
            );

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        await _userManager.AddToRoleAsync(
            user,
            "User"
        );

        return Ok(
            new
            {
                message =
                    "User registered successfully"
            }
        );
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        LoginDto dto
    )
    {
        var user =
            await _userManager.FindByEmailAsync(
                dto.Email
            );

        if (user == null)
        {
            return Unauthorized();
        }

        var result =
            await _signInManager
                .CheckPasswordSignInAsync(
                    user,
                    dto.Password,
                    false
                );

        if (!result.Succeeded)
        {
            return Unauthorized();
        }

        var token =
            await _jwtService.GenerateToken(
                user
            );

        return Ok(new { token });
    }
}