using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class addChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$12$69oBV0SEAFVdbn0DDvWo..vXQqCaubZvWlGvFY8j97ER/pR6/s.Oe");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "PasswordHash",
                value: "$2a$12$9Z.yyl.D/oJHf10Tk/4oeeO7FvE3sGHcUmq5dhB.jeRdk4dqK8Z9K");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$12$Q7Kghe99VOWT3r5h23.3w.vF9KljKI3pdQoLUKjhtP3uTFvFnEwTW");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "PasswordHash",
                value: "$2a$12$bETTsYLrJwWkUVxRFlc8Qe.j52XQGlCbgGgR.6Buau2UBecJ50vLa");
        }
    }
}
