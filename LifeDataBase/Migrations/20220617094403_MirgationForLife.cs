using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace LifeDataBase.Migrations
{
    public partial class MirgationForLife : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LifeStates_LifeUsers_UserEntityId",
                table: "LifeStates");

            migrationBuilder.DropIndex(
                name: "IX_LifeStates_UserEntityId",
                table: "LifeStates");

            migrationBuilder.DropColumn(
                name: "UserEntityId",
                table: "LifeStates");

            migrationBuilder.AlterColumn<long>(
                name: "Id",
                table: "LifeStates",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<Guid>(
                name: "UserID",
                table: "LifeStates",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_LifeStates_UserID",
                table: "LifeStates",
                column: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_LifeStates_LifeUsers_UserID",
                table: "LifeStates",
                column: "UserID",
                principalTable: "LifeUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LifeStates_LifeUsers_UserID",
                table: "LifeStates");

            migrationBuilder.DropIndex(
                name: "IX_LifeStates_UserID",
                table: "LifeStates");

            migrationBuilder.DropColumn(
                name: "UserID",
                table: "LifeStates");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "LifeStates",
                type: "int",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<Guid>(
                name: "UserEntityId",
                table: "LifeStates",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_LifeStates_UserEntityId",
                table: "LifeStates",
                column: "UserEntityId");

            migrationBuilder.AddForeignKey(
                name: "FK_LifeStates_LifeUsers_UserEntityId",
                table: "LifeStates",
                column: "UserEntityId",
                principalTable: "LifeUsers",
                principalColumn: "Id");
        }
    }
}
