# HarmonicInterview

My approach was to first specify several new FastAPI endpoints in collections.py. I specified new POST endpoints for adding individual companies (companies selected through the checkboxes in the UI) as all of the companies for both of the lists. For this project, I thought it might be most clear to add buttons corresponding to each of these functions, which when clicked call the backend functionality to add new entries to the company_collections_associations table. Through MaterialUI, there is a loading overlay (to indicate that function is in progress) and a dialog for when the upload is completed. 

If I were to continue building this feature, my next steps would be to 1) add functionality in order to enable the ability to create a new company collection (adding another list to My List and Liked Companies) as well as 2) updating the UI to change the buttons to a pair of dropdowns indicating two lists that the user is able to add companies between. With multiple lists, a pair of dropdowns feels like a more intuitive UI experience for using this website. In order to maintain this feature, we could adjust the endpoints to accept additional query parameters of the pair of collections (used for the source and destination lists). Additional documentation on the FastAPI endpoints could include unit tests for the endpoints based on the sample data that currently is initialized when you build the project.

https://github.com/user-attachments/assets/9cab6e3a-132a-4812-9d7e-1a2bda4d051e

