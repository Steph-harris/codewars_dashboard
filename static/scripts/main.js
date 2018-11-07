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
      buildChallengeTable(katas)
    }
  });

  function buildChallengeTable(dt){
    console.table(dt)

    table = $("#challenge_tbl");
// get moment.js and format the time
// click on a name, do new call to get the challenge stuff and put it in a modal
    table.DataTable({
      data:dt['data'],
      columns: [
        { data: 'name' },
        { data: 'completedAt' },
        { data: 'completedLanguages',
          render: function ( data ) {
            return data.join(", ");
          }
        },
      ]
    });
  }
});
