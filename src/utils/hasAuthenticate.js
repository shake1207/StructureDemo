const isAbleToRead = function(permissionName) {
  const storedData = JSON.parse(localStorage.getItem('vuex')) || {};

  let permissions = [];

  if (storedData.User && storedData.User.user) {
    permissions = storedData.User.user.MemberLocations;
  }

  let permissionItem = null;

  try {
    permissionItem = permissions.find(
      p => p.LocationClass.toLowerCase() === permissionName.toLowerCase()
    );
  } catch {
    return false;
  }

  return permissionItem ? true : false;
};

module.exports = {
  isAbleToRead: isAbleToRead
};
