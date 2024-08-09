module.exports = {
  async up(db, client) {
    await db.collection('User').updateMany(
      { passwordHash: { $exists: true } },
      {
        $rename: { passwordHash: 'password' },
      },
    );
  },

  async down(db, client) {
    await db.collection('User').updateMany(
      { password: { $exists: true } },
      {
        $rename: { password: 'passwordHash' },
      },
    );
  },
};
