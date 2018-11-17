$(document).ready(function(){
  var kata_map = {
    white: "white",
    yellow: "#edb700",
    blue: "#387dbd",
    purple: "#8669c8"
  }
  // Add JS for spinner
  get_user();
  get_user_challenges();

  $(document).on("click", ".kata-link", function(){
    var kata_id = $(this).attr("data-id");

    get_kata_data(kata_id);
  });

  $("#user_search").on("click", function(){
    var user_val = $("#user_input").val();

    if(user_val && user_val.length > 2){
      get_user(user_val);
      get_user_challenges(user_val)
    }
  });

  $("#kataModal").on("show.bs.modal", function(e){
    clear_kata_modal();
  });

  function build_progress_div(dt){
    if(dt){
      var user = dt['general'];
      var username = user['username'];
      var badge_url = "https://www.codewars.com/users/" + username + "/badges/large";
      var color = user['ranks']['overall']['color'];

      $("#cw_badge").attr("src", badge_url);
      $("#challenge_tbl th")
        .css("color", kata_map[color]);
      $("#completed").text(user['codeChallenges']['totalCompleted']);
    }
  }

  function get_user(user){
    var data = user ? user : "";

    $.get("/user/" + data, function(dt){
      if(dt){
        build_progress_div(dt)
      }
    }).fail(function() {
      console.log( "error" );
    });
  }

  function get_user_challenges(user){
    var data = user ? user : "";

    $.get("/kata/" + data, function(dt){
      if(dt){
        var katas = dt['challenge_info'];

        $("#challenge_tbl").DataTable().destroy();

        buildChallengeTable(katas)
      }
    }).fail(function() {
      console.log( "error" );
    });
  }

  function get_kata_data(kata_id){
    var data = kata_id ? kata_id : "";

    $.post("/kata/" + data, function(dt){
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
    $("#kataModalLabel").html("<a href='"+ dt['url'] +
    "' target='_blank' title='Link to kata's page on codewars.com'>"+ dt['name']+"</a>");
    $("#modal-body").text(dt['description']);
  }

  function clear_kata_modal(){
    $("#kataModalLabel").empty();
    $("#modal-body").empty();
  }

  function buildChallengeTable(dt){
    // fix css for search box and swap with show entries
    table = $("#challenge_tbl");
    table.DataTable({
      data:dt,
      columns: [
        { data: 'name',

          data: {
            name: 'name',
            id: 'id'
          },
          width: "50%",
          render: function ( data ) {
            return '<a href="#" data-id="'+ data.id +
            '" title="challenge kata ID" class="kata-link" data-toggle="modal" data-target="#kataModal">'+
            data.name +'</a>';
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
