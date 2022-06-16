﻿// <auto-generated />
using System;
using LifeDataBase;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace LifeDataBase.Migrations
{
    [DbContext(typeof(LifeContext))]
    partial class LifeContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("LifeDataBase.UserEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("LifeUsers");
                });

            modelBuilder.Entity("TheLiveLogic.LifeState", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Survivors")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid?>("UserEntityId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("UserEntityId");

                    b.ToTable("LifeStates");
                });

            modelBuilder.Entity("TheLiveLogic.LifeState", b =>
                {
                    b.HasOne("LifeDataBase.UserEntity", null)
                        .WithMany("Lifes")
                        .HasForeignKey("UserEntityId");
                });

            modelBuilder.Entity("LifeDataBase.UserEntity", b =>
                {
                    b.Navigation("Lifes");
                });
#pragma warning restore 612, 618
        }
    }
}
