$(document).ready(function(){
  // Add JS for spinner
  $.get("/kata", function(dt){
    if(dt){
      user = dt['general'];
      katas = dt['challenge_info'];

      $("#user_desc").text(user['username']);
      $("#overall").text(user['ranks']['overall']['name'])
        .css("color", user['ranks']['overall']['color']);
      $("#honor").text(user['honor']);
      $("#score").text("(" + user['ranks']['overall']['score'] + ")");
      $("#completed").text(user['codeChallenges']['totalCompleted']);

      console.table(dt['general'])
      console.table(dt['challenge_info'])
    }
  });
});
