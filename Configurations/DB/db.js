db.createUser({
  user: "adminmg_cycatrice",
  pwd: "P_at_cyc4ADB",
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "dbAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" }
  ]
})
