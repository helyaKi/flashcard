using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class SeedUsersWithFixedHashes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$fgOT7gEu2y/DvQDku/XUqugxSMntOmBXt0vdKxSa5cKNJPPD1MooS");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "PasswordHash",
                value: "$2a$11$OTGPEKBzWcPaKM5lWFDkw.9wJB.g/rjHkRMbqdp8g8cSSxLpIXLKW");
        }
    }
}
