export async function fetchData(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Impossible de charger le fichier : ${filePath}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur DataService:", error);
    throw error; // Renvoie l'erreur pour qu'app.js puisse l'afficher
  }
}