// Wix Velo integration for MacroSight.net
// This code should be placed in your Wix site's page code

import { fetch } from 'wix-fetch';

$w.onReady(function () {
    // Find your HTML component iframe
    const htmlComponent = $w('#htmlComponent1'); // Replace with your actual component ID
    
    // Function to load content into iframe
    async function loadPageContent(pageName) {
        try {
            // Fetch the HTML content from your Netlify site
            const response = await fetch(`https://www.macrosight.net/${pageName}.html`);
            const htmlContent = await response.text();
            
            // Post the content to the iframe
            const iframe = htmlComponent.contentWindow;
            iframe.postMessage(htmlContent, 'https://www.macrosight.net');
            
        } catch (error) {
            console.error('Failed to load content:', error);
            // Fallback - load the embed page directly
            htmlComponent.src = `https://www.macrosight.net/embed.html`;
        }
    }
    
    // Load home page by default
    loadPageContent('home');
    
    // Example: Load different pages based on user interaction
    $w('#homeButton').onClick(() => loadPageContent('home'));
    $w('#aboutButton').onClick(() => loadPageContent('about'));
    $w('#projectsButton').onClick(() => loadPageContent('projects'));
    $w('#experienceButton').onClick(() => loadPageContent('experience'));
    $w('#contactButton').onClick(() => loadPageContent('contact'));
    
    // For resume and invest pages, they already have postMessage handling
    $w('#resumeButton').onClick(() => loadPageContent('resume'));
    $w('#investButton').onClick(() => loadPageContent('invest'));
});

// Alternative approach: If you want to use the embed.html for everything
$w.onReady(function () {
    const htmlComponent = $w('#htmlComponent1');
    
    // Set the iframe source to embed.html
    htmlComponent.src = 'https://www.macrosight.net/embed.html';
    
    // Then post content to it
    setTimeout(() => {
        const iframe = htmlComponent.contentWindow;
        
        // You can fetch and post any page content
        fetch('https://www.macrosight.net/home.html')
            .then(response => response.text())
            .then(html => {
                iframe.postMessage(html, 'https://www.macrosight.net');
            });
    }, 1000); // Give iframe time to load
});
