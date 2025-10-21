export async function checkDatabaseSetup() {
  try {
    const response = await fetch("/api/setup/check")
    const data = await response.json()
    return data.isSetup || false
  } catch (error) {
    console.error("[v0] Error checking database setup:", error)
    return false
  }
}

export async function initializeDatabase() {
  try {
    const response = await fetch("/api/setup/initialize", {
      method: "POST",
    })
    const data = await response.json()
    return data.success || false
  } catch (error) {
    console.error("[v0] Error initializing database:", error)
    return false
  }
}
