// adding list of amenities when checked

$(document).ready(function () {
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
    function updateAmenitiesList () {
      const amenityNames = amenitiesIds.map(id => amenitiesDict[id]);
      if (amenityNames.length === 0) {
        amenitiesList.text('\u00a0'); // Use '\u00a0' for non-breaking space
      } else {
        amenitiesList.text(amenityNames.join(', '));
      }
    }
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
        // Handle the error, e.g., display an error message or log the error.
        console.error('AJAX request failed:', status, error);
      }
    });
  });
  