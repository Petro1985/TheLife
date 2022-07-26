using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeDataBase.Migrations
{
    public partial class patterns_change : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PreviewImageBase64",
                table: "Patterns",
                newName: "PreviewBase64");

            migrationBuilder.RenameColumn(
                name: "LastUpdate",
                table: "Patterns",
                newName: "LastChange");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PreviewBase64",
                table: "Patterns",
                newName: "PreviewImageBase64");

            migrationBuilder.RenameColumn(
                name: "LastChange",
                table: "Patterns",
                newName: "LastUpdate");
        }
    }
}
