# Seattle Museum Finder

## Project Description
*The Seattle Museum Finder is an interactive Web GIS application designed to assist in exploring major museums throughout Seattle and the greater Puget Sound area. Our platform gathers museum locations, along with key details about museums and nearby public parking into one easy-to-use map interface. Integrating geospatial visualization and distance-based queries enable users to easily find which museums are closest to the University of Washington or any other area of interest (by manually adjusting the start point). The main focus of this project is usability, accessibility, and clarity to enable UW students and a wider range of visitors to navigate efficiently around local cultural hotspots. Curated data sets, spatial tools facilitated by Mapbox, and intuitive design combine in this application to offer an interactive way of discovering Seattle's rich museum landscape.*

## Favicon
<img src="/img/favicon.png" alt="Map pin with museum in center" style="width:20%; height: auto;">

## Project Goal
*The objective of this project is to develop an intuitive map-based user interface that will enhance not only the way museum attractions in Seattle are explored, but also provide real-world trip planning. By making discovery more accessible and providing essential information with functional features, like distance sorting and available parking nearby, we anticipate users will reduce scattered searches across multiple websites and offer users a single, rich, centralized geospatial platform. The target audience is UW students, Seattle visitors, and any museum enthusiasts who want cultural engagement and straightforward navigation planning. Ultimately, the project aims to find an efficient way to enhance the experience of visiting museums through interactive, location-aware design.*

## Application URL
*[Click here: Web App Link](https://jacw27.github.io/seattle-museum-finder/)*

## Main Functions
- The map allows you to see point data on both museums and parking/garages nearby. 
- All data can be filtered based on travel time and mode of travel. This not only limits the amount of points on the user's screen, but also outlines the area in which our program is accounting for.
- The user can select a start and end point to receive a route, directions, and estimated commute time from Point A to Point B. While the application is designed for locating museums and nearby parking, the user can select any location on the map.

## Other Features
**Hover Feature**
<div>
<img src="/img/hover.gif" alt="Mouse moving over orange points on a map, displaying pop-up with different museum data based on which point it is on" style="width:75%; height: auto;">

The user can hover over museum points (the orange ones) to get a brief look at some of the museum's details. It allows the user to see the museum name, a picture of it, its address, and its hours. 

**Parking Pop-up**
<div>
<img src="/img/parking-pop-up.png" alt="Map with pop-up over blue point, giving parking lot name, address, and number of spots" style="width:75%; height: auto;">

When the user clicks on the parking points (the blue ones), they get a pop-up displaying the garage or lot's name, address, and the number of spots it hosts. 

**Isochrone Shift**
<div>
<img src="/img/mode-duration.gif" alt="Map with shaded area that is changing based on the user-selected mode of travel and desired travel time" style="width:75%; height: auto;">

The map display includes an isochrone, visually demonstrating the area that can be traveled within a certain amount of time. The user can select their mode of travel-- walking, cycling, or driving-- as well as their desired travel time-- 5 minutes, 10 minutes, or 15 minutes. This helps the user to limit their search to their own transportation needs.

**Directions**
<div>
<img src="/img/directions.png" alt="Map showing walking route from the Space Needle to the Museum of Pop Culture, as well as step-by-step directions and estimated travel time of 2 minutes" style="width:75%; height: auto;">

The user can select or search two points to receive a plotted route, as well as step-by-step directions. The directions include the distance to travel, as well as the estimated travel time based on the selected mode of travel.


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

## Acknowledgments
*We first would like to thank Professor Bo Zhao for the guidance, expertise, and inspiring teaching throughout the quarter. His clear explanation and practical demonstration greatly reinforced our understanding of Web GIS development. We also would like to thank Hudson Dougan, our TA, for his constant support during labs, and being always ready to help us troubleshoot technical issues. Lastly, thanks go to Se Chang Kim, our grader, for providing helpful remarks that really allowed us to improve our work and our application as well. Their joint effort made it possible for our group to successfully design, build, and complete the Seattle Museum Finder project.*

## AI Use Disclosure
In this assignment, AI was used for structuring as well as debugging.  

**Structuring**
- Created a geojson template for the *museums.geojson* file. This gave us a starting point as we manually added coordinate, name and other data into the file.
-  Helped us to structure the on-click events for parking garages. This ensured that the garage would turn into the routing destination on the map after clicks.


**Debugging**
- AI was used to debug the isochrone api section that allows the map to move when the user clicks on a location.
- AI was used to debug the isochrone distance starting point to match the routing starting point.
