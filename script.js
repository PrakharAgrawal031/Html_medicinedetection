// Load the Teachable Machine model
let model;
// const modelURL = "https://teachablemachine.withgoogle.com/models/RI_wubqTe/model.json"; // Replace with your model URL
// const metadataURL = "https://teachablemachine.withgoogle.com/models/RI_wubqTe/metadata.json"; // Replace with your metadata URL
// import plantData from './Details.js';

let plantData  = {
    "turmeric":{
        "name":"Turmeric",
        "scientific_name": "Curcuma longa",
        "specie_locations": "India , Nepal",
        "description": "Turmeric is a flowering plant native to Southeast Asia, known for its bright yellow or orange rhizomes. It belongs to the ginger family, Zingiberaceae. Turmeric is widely used as a spice and a traditional medicine. It is known for its anti-inflammatory and antioxidant properties and is a key ingredient in many Asian dishes."
    }
}

// Get references to HTML elements
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');

// Add an event listener to the file input element
imageInput.addEventListener('change', (event) => {
    // Get the selected file
    const selectedFile = event.target.files[0];

    // Check if a file was selected
    if (selectedFile) {
        // Create a FileReader to read the selected file
        const reader = new FileReader();

        // Set up a function to run when the FileReader has finished reading the file
        reader.onload = (e) => {
            // Set the source of the image preview to the data URL
            imagePreview.src = e.target.result;
        };

        // Read the file as a data URL (this will trigger the `onload` function)
        reader.readAsDataURL(selectedFile);
    } else {
        // If no file was selected, clear the image preview
        imagePreview.src = '';
    }
});


async function loadModel() {
    loaderContainer.style.display = 'flex';
    const modelURL = "https://teachablemachine.withgoogle.com/models/RI_wubqTe/model.json"; // Replace with your model URL
    const metadataURL = "https://teachablemachine.withgoogle.com/models/RI_wubqTe/metadata.json"; // Replace with your metadata URL

    // const modelURL = './model.json';
   
    model = await tmImage.load(modelURL, metadataURL);
    console.log('Model loaded successfully');
    // console.log(plantData);
    loaderContainer.style.display = 'none';
}
function extractObjectWithHighestProbability(objects) {
    if (!Array.isArray(objects) || objects.length === 0) {
      return null; // Return null for invalid input
    }
  
    let highestProbabilityObject = objects[0]; // Initialize with the first object
  
    for (let i = 1; i < objects.length; i++) {
      if (objects[i].probability > highestProbabilityObject.probability) {
        highestProbabilityObject = objects[i];
      }
    }
  
    return highestProbabilityObject;
  }
// Function to predict the uploaded image
async function predictImage() {
    loaderContainer.style.display = 'flex';
    const imageInput = document.getElementById('imageInput');
    const predictionResult = document.getElementById('predictionResult');

    if (!model) {
        console.error('Model not loaded yet.');
        return;
    }

    if (!imageInput.files || imageInput.files.length === 0) {
        console.error('Please select an image.');
        return;
    }

    const file = imageInput.files[0];
    const imageURL = URL.createObjectURL(file);

    const img = new Image();
    img.src = imageURL;

    img.onload = async () => {
        try {
           
            const prediction = await model.predict(img);
         

            console.log('Prediction:', prediction);
         
            
            const highestProbabilityObject = extractObjectWithHighestProbability(prediction);
            console.log(highestProbabilityObject);
            let plant =highestProbabilityObject.className;
            let speciesObject = `plantData.${plant}`
            console.log(plantData.plant);
            
            highest_prediction.innerText = JSON.stringify(`predicted specie - ${highestProbabilityObject.className}`);
            highest_probability.innerText = JSON.stringify(`probability - ${highestProbabilityObject.probability}`);
            speciesName.innerText = JSON.stringify(`${speciesObject.name}`);
            scientificName.innerText = JSON.stringify(`${speciesObject.scientific_name}`);
            specieLocations.innerText = JSON.stringify(`${speciesObject.specie_locations}`);
            specieDetails.innerText = JSON.stringify(`${speciesObject.description}`);


            // predictionResult.innerText = JSON.stringify(prediction, null, 2);
            loaderContainer.style.display = 'none';
        } catch (error) {
            console.error('Error predicting image:', error);
            loaderContainer.style.display = 'none';
        }
    };
}

// Initialize the model when the page loads
window.addEventListener('load', loadModel);

