
# Weather Window

## Project Overview

Weather Window is a web application designed to help people plan outdoor activities by providing an overview of upcoming weather conditions.

The application will allow users to search for a location, view current weather conditions and explore an hourly forecast to help identify potentially suitable times to go for a walk.

## Problem Statement

People planning outdoor activities often need to consider changing weather conditions, particularly rainfall, temperature and wind.

Weather Window aims to make this information easy to access and understand in one simple interface.

## Project Objectives

- Allow users to search for a town or city.
- Retrieve weather information from an external API.
- Display current weather conditions.
- Display an hourly weather forecast.
- Highlight an hour with a comparatively low probability of rainfall.
- Handle invalid searches and API errors appropriately.
- Analyse hourly weather forecasts using predefined criteria.
- Identify potentially suitable times for outdoor activities.
- Explain why a particular time has been recommended.

## Walking Recommendation Logic

The application uses a simple rule-based approach
to identify potentially suitable walking conditions.

The initial criteria are:

- Rain probability of 30% or lower.
- Wind speed of 25 km/h or lower.
- Temperature between 5°C and 25°C.

Where multiple hours meet these criteria, the
application selects the hour with the lowest
rain probability, using wind speed as a tie-breaker.

These thresholds are configurable prototype
assumptions, not official safety recommendations.

## Technologies

- HTML – application structure
- CSS – application styling
- JavaScript – application functionality
- Open-Meteo – weather data API
- Git – version control
- GitHub – online source code repository

## Project Status

Currently in the planning and development setup stage.

## Future Improvements

- Allow users to switch between Celsius and Fahrenheit.
- Improve the weather recommendation logic.
- Make the application responsive across different screen sizes.

## Disclaimer

Weather recommendations are based on forecast information and simple criteria. They are indicative only, and weather conditions can change.