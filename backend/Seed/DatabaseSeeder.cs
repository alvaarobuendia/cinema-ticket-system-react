using CinemaTicketSystem.Api.Data;
using CinemaTicketSystem.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CinemaTicketSystem.Api.Seed;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(
        IServiceProvider serviceProvider
    )
    {
        using var scope = serviceProvider.CreateScope();

        var roleManager = scope.ServiceProvider
            .GetRequiredService<RoleManager<IdentityRole>>();

        var userManager = scope.ServiceProvider
            .GetRequiredService<UserManager<ApplicationUser>>();

        var context = scope.ServiceProvider
            .GetRequiredService<ApplicationDbContext>();

        await SeedRolesAsync(roleManager);

        await SeedAdminAsync(
            userManager,
            scope.ServiceProvider.GetRequiredService<IConfiguration>()
        );

        await SeedCinemasAsync(context);
    }

    private static async Task SeedRolesAsync(
        RoleManager<IdentityRole> roleManager
    )
    {
        string[] roles = { "Admin", "User" };

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(
                    new IdentityRole(role)
                );
            }
        }
    }

    private static async Task SeedAdminAsync(
        UserManager<ApplicationUser> userManager,
        IConfiguration configuration
    )
    {
        var adminEmail =
            configuration["AdminUser:Email"];

        var adminPassword =
            configuration["AdminUser:Password"];

        if (string.IsNullOrWhiteSpace(adminEmail) ||
            string.IsNullOrWhiteSpace(adminPassword))
        {
            return;
        }

        var admin = await userManager.FindByEmailAsync(
            adminEmail
        );

        if (admin != null)
        {
            return;
        }

        admin = new ApplicationUser
        {
            UserName = adminEmail,
            Email = adminEmail,
            FirstName = "System",
            LastName = "Administrator",
            PhoneNumber = "000000000"
        };

        var result = await userManager.CreateAsync(
            admin,
            adminPassword
        );

        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(
                admin,
                "Admin"
            );
        }
    }

    private static async Task SeedCinemasAsync(
        ApplicationDbContext context
    )
    {
        if (await context.Cinemas.AnyAsync())
        {
            return;
        }

        var cinemas = new List<Cinema>
        {
            new Cinema
            {
                Name = "Cinema Central",
                Rows = 8,
                SeatsPerRow = 10
            },
            new Cinema
            {
                Name = "Cinema North",
                Rows = 10,
                SeatsPerRow = 12
            },
            new Cinema
            {
                Name = "Cinema South",
                Rows = 6,
                SeatsPerRow = 8
            }
        };

        context.Cinemas.AddRange(cinemas);

        await context.SaveChangesAsync();
    }
}
