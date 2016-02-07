/**
 * Format WKID spatial reference variations into a standard structure.
 *
 * @param  {string|number|object} spatialRef - spatial reference variation
 * @return {object} standard spatial reference object
 */
function formatSpatialRef (spatialRef) {
  if (typeof spatialRef === 'string') {
    try {
      return JSON.parse(spatialRef)
    } catch (e) {
      return spatialRef
    }
  }

  if (typeof spatialRef === 'number') {
    return {
      wkid: spatialRef
    }
  }

  return spatialRef
}

module.exports = formatSpatialRef
