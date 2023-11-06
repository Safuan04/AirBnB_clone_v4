// adding list of amenities when checked

$(document).ready(function () {
  // Declare amenityNames in a higher scope
  let amenityNames = [];

  const checkbox = $('.check');
  const amenitiesList = $('.amenities-list');
  const amenitiesDict = {};
  const amenitiesIds = [];

  checkbox.click(function () {
    const amenityId = $(this).data('id');
    const amenityName = $(this).data('name');

    if ($(this).is(':checked')) {
      amenitiesDict[amenityId] = amenityName;
      amenitiesIds.push(amenityId);
      updateAmenitiesList();
    } else {
      delete amenitiesDict[amenityId];
      const index = amenitiesIds.indexOf(amenityId);
      if (index !== -1) {
        amenitiesIds.splice(index, 1);
        updateAmenitiesList();
      }
    }
  });

  // Updates the amenities checked list
  function updateAmenitiesList () {
    // Update the amenityNames variable in the higher scope
    amenityNames = amenitiesIds.map(id => amenitiesDict[id]);

    if (amenityNames.length === 0) {
      amenitiesList.text('\u00a0'); // '\u00a0' for non-breaking space
    } else {
      amenitiesList.text(amenityNames.join(', '));
    }
  }

  // Status code
  $.ajax({
    type: 'GET',
    url: 'http://' + window.location.hostname + ':5001/api/v1/status/',
    success: function (data) {
      const dataStatus = data.status;
      if (dataStatus === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    },
    error: function (xhr, status, error) {
      // Handling the error, e.g., display an error message or log the error.
      console.error('AJAX request failed:', status, error);
    }
  });

  // Filter places by Amenity
  const button = $('button');
  button.click(function () {
    $.ajax({
      type: 'POST',
      url: 'http://' + window.location.hostname + ':5001/api/v1/places_search/',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({}),
      success: function (places) {
        const section = $('section.places');
        section.empty();
        for (const place of places) {
          $.ajax({
            type: 'GET',
            url: 'http://' + window.location.hostname + `:5001/api/v1/places/${place.id}/amenities`,
            contentType: 'application/json',
            dataType: 'json',
            success: function (placeAmenities) {
              const hasDesiredAmenities = placeAmenities.some(amenity => {
                return amenity && amenity.name && amenityNames.includes(amenity.name);
              });
              if (hasDesiredAmenities) {
                console.log(place.name);
                const article = $('<article>');
                // Create the inner structure for the place details
                const titleBox = $('<div class="title_box">');
                titleBox.append(`<h2>${place.name}</h2>`);
                titleBox.append(`<div class="price_by_night">$${place.price_by_night}</div>`);

                const information = $('<div class="information">');
                information.append(`<div class="max_guest">${place.max_guest} Guests</div>`);
                information.append(`<div class="number_rooms">${place.number_rooms} Bedrooms</div>`);
                information.append(`<div class="number_bathrooms">${place.number_bathrooms} Bathrooms</div>`);

                // Remove the Owner tag from the description
                const description = $('<div class="description">');
                description.append(place.description);
                // Append the inner elements to the article
                article.append(titleBox);
                article.append(information);
                article.append(description);
                // Append the article to the section
                section.append(article);
              }
            }
          });
        }
      }
    });
  });
});
