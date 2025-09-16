using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class lowerCaseRoleAdd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "PasswordHash", "Role", "Username" },
                values: new object[] { "$2a$12$tpZHVZmXBf2ZLvuupJGh7OQOQ/09aqKxWMwmeIzuxEda7meggYXg2", "admin", "main_admin" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "PasswordHash", "Role", "Username" },
                values: new object[] { "$2a$12$wuwoEsiKXNCwg.z/T8pIhexLlovYRZ4eA/6741pUP4rD3oSDp0yFK", "user", "main_user" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "PasswordHash", "Role", "Username" },
                values: new object[] { "$2a$12$69oBV0SEAFVdbn0DDvWo..vXQqCaubZvWlGvFY8j97ER/pR6/s.Oe", "Admin", "admin" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "PasswordHash", "Role", "Username" },
                values: new object[] { "$2a$12$9Z.yyl.D/oJHf10Tk/4oeeO7FvE3sGHcUmq5dhB.jeRdk4dqK8Z9K", "User", "user" });
        }
    }
}
