export async function getPosts() {
  const response = await fetch('http://localhost:6000/items');
  return response.json();
} 