import * as THREE from 'three'; // Import MathUtils as well
// Optional: Import OrbitControls for camera interaction
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- Hardcoded Data ---

// --- Three.js Setup ---
const container = document.getElementById('threejs-container');
let scene, camera, renderer;
let shapeGroup; // Group to hold our pattern of shapes

function initThreeJS() {
    if (!container) {
        console.error("Three.js container not found!");
        return;
    }

    // Scene
    scene = new THREE.Scene();
    // Set to null for transparent background, or keep a color
    scene.background = new THREE.Color(0x11111f); // Dark blueish background example

    // Camera
    const fov = 75;
    const aspect = container.clientWidth / container.clientHeight;
    const near = 0.1;
    const far = 1000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 5; // Move camera back

    // Renderer
    // Add alpha: true if you want transparency to CSS background
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight); // Use window size
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // --- Create Shape Pattern ---
    shapeGroup = new THREE.Group();
    const numShapes = 200; // How many shapes to create
    const shapeSize = 0.1; // Size of each individual shape
    const spread = 10; // How far the shapes spread out

    const geometry = new THREE.IcosahedronGeometry(shapeSize, 0); // Use Icosahedron (20 faces)
    const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0xaaaaFF, // A light blueish color
        roughness: 0.4,
        metalness: 0.6
    });

    for (let i = 0; i < numShapes; i++) {
        const material = baseMaterial.clone();
        // Optional: Slightly vary color per shape
        // material.color.offsetHSL( (Math.random() - 0.5) * 0.1, 0, 0 );

        const shape = new THREE.Mesh(geometry, material);

        // Random position within a cube volume
        shape.position.set(
            THREE.MathUtils.randFloatSpread(spread), // x: -spread/2 to +spread/2
            THREE.MathUtils.randFloatSpread(spread), // y
            THREE.MathUtils.randFloatSpread(spread)  // z
        );
        // Random rotation
        shape.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
        );
        // Optional: Random scale
        // const scale = THREE.MathUtils.randFloat(0.5, 1.5);
        // shape.scale.set(scale, scale, scale);

        shapeGroup.add(shape);
    }
    scene.add(shapeGroup);
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

    // Rotate the entire group of shapes slowly
    if (shapeGroup) {
        shapeGroup.rotation.y += 0.0005; // Slow rotation on Y axis
        shapeGroup.rotation.x += 0.0002; // Even slower rotation on X axis
    }

    // Required if controls.enableDamping is set to true
    // controls.update();

    renderer.render(scene, camera);
}

// --- Hardcoded Data Fetching ---

function fetchProjects() {
    console.log("Loading hardcoded projects...");
    const projectListDiv = document.getElementById('project-list');

    // Define your hardcoded projects here
    const hardcodedProjects = [
        {
            title: "My Awesome Project 1",
            description: "This is the first project I made. It does cool things.",
            url: "https://example.com/project1",
            repoUrl: "https://github.com/yourusername/project1"
            // Add other fields as needed, e.g., imageUrl: "path/to/image.jpg"
        },
        {
            title: "Another Interesting Project",
            description: "Built using technology X and Y. Focuses on Z.",
            // url: null, // Example: No live URL
            repoUrl: "https://github.com/yourusername/project2"
        },
        // Add more project objects here
    ];

    displayProjects(hardcodedProjects);
}

function fetchBlogPosts() {
    console.log("Loading hardcoded blog posts...");
    const blogPostListDiv = document.getElementById('blog-post-list');

    // Define your hardcoded blog posts here
    const hardcodedBlogPosts = [
        {
            title: "First Blog Post Title",
            $createdAt: "2023-10-26T10:00:00.000Z", // Use ISO 8601 format string for dates
            summary: "This is a short summary of my first blog post...",
            content: "This is the full content of the first blog post, which might be longer..." // You might use summary or content
            // Add other fields as needed
        },
        {
            title: "Thoughts on Web Development",
            $createdAt: "2023-10-20T15:30:00.000Z",
            summary: "Exploring recent trends in front-end development.",
            content: "Detailed thoughts on frameworks, libraries, and the future."
        },
        // Add more blog post objects here
    ];

    displayBlogPosts(hardcodedBlogPosts);
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
        // --- Create header and details container ---
        const header = document.createElement('h3');
        header.textContent = project.title || 'Untitled Project';

        // Create a container for everything that collapses
        const collapsibleContainer = document.createElement('div');
        collapsibleContainer.classList.add('collapsible-container');
        collapsibleContainer.innerHTML = `
            <p>${project.description || 'No description available.'}</p>
            ${project.url ? `<a href="${project.url}" target="_blank" rel="noopener noreferrer">View Project</a>` : ''}
            ${project.repoUrl ? `<br><a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer">View Repository</a>` : ''}
            <!-- Add more fields like technologies used, image, etc. -->
        `;

        // Append header and the collapsible container to the item
        item.appendChild(header);
        item.appendChild(collapsibleContainer);

        // Add click listener to the item (or header) to toggle expansion
        item.addEventListener('click', () => {
            item.classList.toggle('expanded');
        });

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
        // Create header, date, and content container
        const header = document.createElement('h3');
        header.textContent = post.title || 'Untitled Post';

        // Create a container for everything that collapses
        const collapsibleContainer = document.createElement('div');
        collapsibleContainer.classList.add('collapsible-container');

        // Create and add date paragraph to the container
        const datePara = document.createElement('p');
        datePara.innerHTML = `<em>Published: ${new Date(post.$createdAt).toLocaleDateString()}</em>`;
        collapsibleContainer.appendChild(datePara);

        // Create and add content paragraph to the container
        const contentPara = document.createElement('p');
        contentPara.innerHTML = `${post.summary || post.content?.substring(0, 150) + '...' || 'No content preview.'}`;
        collapsibleContainer.appendChild(contentPara);

        // Optional: Add 'Read More' link to the container if needed
        // const readMoreLink = document.createElement('a');
        // readMoreLink.href = `/blog/${post.$id}`; // Example link
        // readMoreLink.textContent = 'Read More';
        // collapsibleContainer.appendChild(readMoreLink);

        // Append header and the collapsible container to the item
        item.appendChild(header);
        item.appendChild(collapsibleContainer);


        // Add click listener to the item (or header) to toggle expansion
        item.addEventListener('click', () => {
            item.classList.toggle('expanded');
        });

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
