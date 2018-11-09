$(document).ready(function(){
  // Add JS for spinner
  get_default_user();
  get_user_challenges();

  $(document).on("click", ".kata-link", function(){
    var kata_id = $(this).attr("data-id");

    get_kata_data(kata_id);
  });

  function build_progress_div(dt){
    if(dt){
      var user = dt['general'];
      var username = user['username'];
      var badge_url = "https://www.codewars.com/users/" + username + "/badges/large";

      $("#cw_badge").attr("src", badge_url);
      $("#challenge_tbl th")
        .css("color", user['ranks']['overall']['color']);
      $("#completed").text(user['codeChallenges']['totalCompleted']);
    }
  }

  function get_default_user(){
    // can update this to just send in user input instead of get_user_from_input
    $.get("/user", function(dt){
      if(dt){
        build_progress_div(dt)
      }
    }).fail(function() {
      console.log( "error" );
    });
  }

  function get_user_from_input(){
    //for user submitted search
    // grab input by id
    var user_id = $("#cw_username");

    $.post("/user",
      { user_id: user_id }, function(dt){
      if(dt){
        console.table(dt);
      }
    }).fail(function() {
      console.log( "error" );
    });;
  }

  function get_user_challenges(){
    $.get("/kata", function(dt){
      if(dt){
        var katas = dt['challenge_info'];

        buildChallengeTable(katas)
      }
    }).fail(function() {
      console.log( "error" );
    });
  }

  function get_kata_data(kata_id){
    $.post("/kata",
      { id: kata_id }, function(dt){
      if(dt){
        var challenge_desc = dt['challenge'];

        build_challenge_modal(challenge_desc);
      }
    }).fail(function() {
      console.log( "error" );
    });
  }

  function build_challenge_modal(dt){
    console.table(dt);
  }

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
      dom: '<lfip<t>>',
      order: [[1, 'desc']]
    });
  }
});
