import * as THREE from 'three';
// Optional: Import OrbitControls for camera interaction
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- Appwrite Setup ---
// Make sure to replace with your actual Appwrite endpoint and project ID
const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1'; // Or your self-hosted endpoint
const APPWRITE_PROJECT_ID = 'YOUR_PROJECT_ID'; // Replace with your project ID
const PROJECTS_DATABASE_ID = 'YOUR_PROJECTS_DATABASE_ID'; // Replace with your database ID
const PROJECTS_COLLECTION_ID = 'YOUR_PROJECTS_COLLECTION_ID'; // Replace with your collection ID
const BLOG_DATABASE_ID = 'YOUR_BLOG_DATABASE_ID'; // Replace with your database ID (can be same as projects)
const BLOG_COLLECTION_ID = 'YOUR_BLOG_COLLECTION_ID'; // Replace with your collection ID

const { Client, Databases, ID, Query } = Appwrite; // Destructure from Appwrite SDK

const client = new Client();
client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

const databases = new Databases(client);

// --- Three.js Setup ---
const container = document.getElementById('threejs-container');
let scene, camera, renderer;
let cube; // Example 3D object

function initThreeJS() {
    if (!container) {
        console.error("Three.js container not found!");
        return;
    }

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222); // Match CSS background

    // Camera
    const fov = 75;
    const aspect = container.clientWidth / container.clientHeight;
    const near = 0.1;
    const far = 1000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 5; // Move camera back

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight); // Use window size
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Basic 3D Object (Example: Cube)
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Use MeshStandardMaterial for lighting
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Lighting (Essential for MeshStandardMaterial)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Optional: Orbit Controls
    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    // controls.dampingFactor = 0.05;
    // controls.screenSpacePanning = false;
    // controls.minDistance = 2;
    // controls.maxDistance = 10;
    // controls.maxPolarAngle = Math.PI / 2;

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);

    // Start animation loop
    animate();
}

function onWindowResize() {
    if (!container || !renderer || !camera) return;
    camera.aspect = window.innerWidth / window.innerHeight; // Use window size
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight); // Use window size
}

function animate() {
    requestAnimationFrame(animate);

    // Example animation: Rotate the cube
    if (cube) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    }

    // Required if controls.enableDamping is set to true
    // controls.update();

    renderer.render(scene, camera);
}

// --- Appwrite Data Fetching ---

async function fetchProjects() {
    console.log("Fetching projects...");
    const projectListDiv = document.getElementById('project-list');
    try {
        const response = await databases.listDocuments(
            PROJECTS_DATABASE_ID,
            PROJECTS_COLLECTION_ID,
            // Add queries here if needed, e.g., [Query.limit(10)]
        );
        console.log("Projects response:", response);
        displayProjects(response.documents);
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        projectListDiv.innerHTML = '<p>Error loading projects.</p>';
    }
}

async function fetchBlogPosts() {
    console.log("Fetching blog posts...");
    const blogPostListDiv = document.getElementById('blog-post-list');
    try {
        const response = await databases.listDocuments(
            BLOG_DATABASE_ID,
            BLOG_COLLECTION_ID,
             // Add queries here if needed, e.g., [Query.orderDesc('$createdAt'), Query.limit(5)]
        );
        console.log("Blog posts response:", response);
        displayBlogPosts(response.documents);
    } catch (error) {
        console.error("Failed to fetch blog posts:", error);
        blogPostListDiv.innerHTML = '<p>Error loading blog posts.</p>';
    }
}

// --- Display Functions ---

function displayProjects(projects) {
    const projectListDiv = document.getElementById('project-list');
    if (!projects || projects.length === 0) {
        projectListDiv.innerHTML = '<p>No projects found.</p>';
        return;
    }

    projectListDiv.innerHTML = ''; // Clear loading message
    projects.forEach(project => {
        const item = document.createElement('div');
        item.classList.add('project-item');
        // --- Customize based on your Appwrite collection attributes ---
        item.innerHTML = `
            <h3>${project.title || 'Untitled Project'}</h3>
            <p>${project.description || 'No description available.'}</p>
            ${project.url ? `<a href="${project.url}" target="_blank" rel="noopener noreferrer">View Project</a>` : ''}
            ${project.repoUrl ? `<br><a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer">View Repository</a>` : ''}
            <!-- Add more fields like technologies used, image, etc. -->
        `;
        // Example: Assuming you have an 'imageUrl' attribute
        // if (project.imageUrl) {
        //     const img = document.createElement('img');
        //     img.src = project.imageUrl; // Or construct URL using Appwrite storage if needed
        //     img.alt = project.title || 'Project Image';
        //     img.style.maxWidth = '100%'; // Basic image styling
        //     item.prepend(img); // Add image at the beginning
        // }
        projectListDiv.appendChild(item);
    });
}

function displayBlogPosts(posts) {
    const blogPostListDiv = document.getElementById('blog-post-list');
    if (!posts || posts.length === 0) {
        blogPostListDiv.innerHTML = '<p>No blog posts found.</p>';
        return;
    }

    blogPostListDiv.innerHTML = ''; // Clear loading message
    posts.forEach(post => {
        const item = document.createElement('div');
        item.classList.add('blog-post-item');
         // --- Customize based on your Appwrite collection attributes ---
        item.innerHTML = `
            <h3>${post.title || 'Untitled Post'}</h3>
            <p><em>Published: ${new Date(post.$createdAt).toLocaleDateString()}</em></p>
            <p>${post.summary || post.content.substring(0, 150) + '...' || 'No content preview.'}</p>
            <!-- Add a link to a full blog post page if you create one -->
            <!-- <a href="/blog/${post.$id}">Read More</a> -->
        `;
        blogPostListDiv.appendChild(item);
    });
}

// --- Initialization ---
function setFooterYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// Run initialization functions when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    fetchProjects();
    fetchBlogPosts();
    setFooterYear();
});
