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
  });
  