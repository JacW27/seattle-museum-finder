# Seattle Museum Finder

## Project Description
*The Seattle Museum Finder is an interactive Web GIS application created to assist users in exploring major museums throughout Seattle and the greater Puget Sound area. Our platform consolidates the locations of museums, key details about them, and information on nearby public parking into a single, easy-to-use map interface. With integrated geospatial visualization and distance-based queries, it will be easy for users to identify museums nearest to the University of Washington or any area of interest. The project emphasizes usability, accessibility, and clarity to enable UW students and visitors alike to move efficiently around local cultural destinations. Curated data sets, spatial tools facilitated by Mapbox, and intuitive design combine in this application to offer an interactive way of discovering Seattle's rich museum landscape.*

## Favicon
![Map pin with museum in center](/img/favicon.png)

## Project Goal
*The purpose of the project is to create a seamless and intuitive map-based user interface that improves how Seattle's museum attractions are explored while providing real-world trip planning. By making discovery more accessible-by consolidating essential information with functional features such as distance sorting and nearby parking availability, we expect users to reduce scattered searches on multiple websites and offer users a single centralized, geospatially rich platform. The application is envisioned for UW students, campus visitors, and museum enthusiasts who look forward to cultural engagement and easy planning of short visits or longer outings. Ultimately, the project aims at meaningfully enhancing the experience of going to museums through interactive, location-aware design.*

## Application URL
*[Click here: Web App Link](https://jacw27.github.io/seattle-museum-finder/)*

## Screenshots
*Screenshots*

## Main Functions
- *Function 1*
- *Function 2*
- *Function 3*

## Data Sources
- **Seattle Museums (custom GeoJSON)**  
  Since there were no existing datasets of local museums available for ready utilization, museum coordinates and other details were manually gathered using Visit Seattle’s museum list: https://visitseattle.org/things-to-do/arts-culture/museums/local-and-regional-museums/. Geojson.io was used to input details like name, address, hours, URL, source, and category into a GeoJSON map.

- **Public Garages and Parking Lots – City of Seattle**  
  We relied on the “Public Garages and Parking Lots” dataset offered at the Seattle Open Data Portal: https://data-seattlecitygis.opendata.arcgis.com/datasets/3029d63401544cd6b9783ef1bfb40b91_1/explore. We wrote a Python code using GeoPandas and the Unary Union function provided under Shapely, which helped identify garages.

- **Data Cleaning and Map Readability**  
  To not overburden the map with too much additional detail, we chose not to map parking facilities outside of these quarter-mile zones. There are still plenty of garages included in the downtown areas, so we included a Toggle Layer for these symbols related to parking facilities.

## Applied Libraries & Web Services
- *Mapbox GL JS*
- *GitHub Pages*
- *Any other frameworks or services used*

## Acknowledgments
*We first would like to thank Professor Bo Zhao for the guidance, expertise, and inspiring teaching throughout the quarter. His clear explanation and practical demonstration greatly reinforced our understanding of Web GIS development. We also would like to thank Hudson Dougan, our TA, for his constant support during labs, and being always ready to help us troubleshoot technical issues. Lastly, thanks go to Se Chang Kim, our grader, for providing helpful remarks that really allowed us to improve our work and our application as well. Their joint effort made it possible for our group to successfully design, build, and complete the Seattle Museum Finder project.*

## AI Use Disclosure
*AI Use Disclosure*
