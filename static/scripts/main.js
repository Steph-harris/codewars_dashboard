$(document).ready(function(){
  // Add JS for spinner
  $.get("/kata", function(dt){
    if(dt){
      user = dt['general'];
      katas = dt['challenge_info'];

      $("#user_desc").text(user['username']);
      $("#overall").text(user['ranks']['overall']['name'])
        .css("color", user['ranks']['overall']['color']);
      $("#challenge_tbl th")
        .css("color", user['ranks']['overall']['color']);
      $("#honor").text(user['honor']);
      $("#score").text("(" + user['ranks']['overall']['score'] + ")");
      $("#completed").text(user['codeChallenges']['totalCompleted']);

      buildChallengeTable(katas)
    }
  });

  $(document).on("click", ".kata-link", function(){
    var kata_id = $(this).attr("data-id");

    $.post("/kata",
      { id: kata_id }, function(dt){
      if(dt){
        console.table(dt);
      }
    });
  });

  function buildChallengeTable(dt){
    // fix css for search box and swap with show entries
    table = $("#challenge_tbl");
    table.DataTable({
      data:dt['data'],
      columns: [
        { data: 'name',

          data: {
            name: 'name',
            id: 'id'
          },
          width: "50%",
          render: function ( data ) {
            // make link to open modal
            return '<a href="#" data-id="'+data.id+'" title="challenge kata ID" class="kata-link">'+ data.name +'</a>';
          }
        },
        { data: 'completedAt',
          render: function(data){
            return moment(data).format("YYYY-MM-DD h:mm:ss a")
          }
        },
        { data: 'completedLanguages',
          render: function ( data ) {
            return data.join(", ");
          }
        }
      ],
      dom: '<lfip<t>>'
    });
  }
});
