BEGIN TRANSACTION;
DROP INDEX [IX_Users_Username] ON [Users];

DECLARE @var sysname;
SELECT @var = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Users]') AND [c].[name] = N'Username');
IF @var IS NOT NULL EXEC(N'ALTER TABLE [Users] DROP CONSTRAINT [' + @var + '];');
ALTER TABLE [Users] DROP COLUMN [Username];

ALTER TABLE [Users] ADD [FullName] nvarchar(100) NOT NULL DEFAULT N'';

ALTER TABLE [Users] ADD [PhoneNumber] nvarchar(20) NOT NULL DEFAULT N'';

CREATE UNIQUE INDEX [IX_Users_PhoneNumber] ON [Users] ([PhoneNumber]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251026052125_UpdateUserSchema', N'9.0.10');

COMMIT;
GO

