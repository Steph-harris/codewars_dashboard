$(document).ready(function(){
  var kata_map = {
    white: "white",
    yellow: "#edb700",
    blue: "#387dbd",
    purple: "#8669c8"
  }

  get_user();
  get_user_challenges();
  $('#error_message').hide()

  $(document).on("click", ".kata-link", function(){
    var kata_id = $(this).attr("data-id");

    get_kata_data(kata_id);
  });

  // toggle between badge sizes depending on screen size
  $(window).on("resize", function(){
    var view = $(window).width();
    var img_src = $("#cw_badge").attr("src");
    var split_url = img_src.split("/");
    var src_sz = split_url.pop();
    var username = split_url[4];
    var new_url = "https://www.codewars.com/users/" + username + "/badges/";
    var badge_url;

    if(view <= 400 && src_sz == "large"){
      badge_url = new_url + "small";

      $("#cw_badge").attr("src", badge_url);
    } else if (view > 400 && src_sz == "small"){
      badge_url = new_url + "large";

      $("#cw_badge").attr("src", badge_url);
    }
  });

  $("#user_search").on("click", function(){
    var user_val = $("#user_input").val();

    if(user_val && user_val.length > 2){
      get_user(user_val);
      get_user_challenges(user_val);
      $("#user_input").val("");
    }
  });

  $("#kataModal").on("show.bs.modal", function(e){
    clear_kata_modal();
    show_loader("#kataModal");
  });

  function show_loader(target_id){
    $(target_id).append('<div class="loader"></div>');
  }

  function hide_loader(target_id){
    $(target_id).find('.loader').remove();
  }

  function build_progress_div(dt){
    if(dt){
      var user = dt['general'];
      var username = user['username'];
      var badge_url = "https://www.codewars.com/users/" + username + "/badges/large";
      var color = user['ranks']['overall']['color'];

      var user_div = `<div>
        <img id='cw_badge' src=${badge_url} alt="user's display banner with rank from codewars" />
        <br>
        <p>
          Kata Completed: <span id="completed">
          ${user['codeChallenges']['totalCompleted']}
          </span>
        </p>
        <p>
          Kata Authored: <span id="authored">
            ${user['codeChallenges']['totalAuthored']}
          </span>
        </p>
      </div>`;

      $('#user_div').html(user_div);

      $("#challenge_tbl th")
        .css("color", kata_map[color]);
      //name
      //clan (if clan)
      //leaderboardPosition
      //rank
      //skills (if none listed, loop over keys in['ranks']['languages'] )
    }
  }

  function get_user(user){
    var data = user ? user : "";

    show_loader('#user_div');

    $.get("/user/" + data, function(dt){
      if(dt){
        build_progress_div(dt)
      } else{
        const duration = 3000
        // show error
        $('#error_message').show()
        setTimeout(function () {
          $('#error_message').hide();
        }, duration);
      }
    }).done(function() {
      hide_loader('#user_div');
      hide_loader('#main');
    }).fail(function() {
      hide_loader('#user_div');
      hide_loader('#main');
      console.log( "Error: get user failed" );
    });
  }

  function get_user_challenges(user){
    var data = user ? user : "";

    show_loader('#main');

    $.get("/kata/" + data, function(dt){
      if(dt){
        var katas = dt['challenge_info'];

        $("#challenge_tbl").DataTable().destroy();

        buildChallengeTable(katas, user);
      }
    }).done(function() {
      hide_loader('#main');
    }).fail(function() {
      hide_loader('#user_div');
      console.log( "Error: get user kata failed" );
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
      console.log( "Error: get kata failed" );
    });
  }

  function build_challenge_modal(dt){
    var kata_pct = "N/A";

    console.table(dt);

    if(dt['totalAttempts'] && dt['totalCompleted']){
      kata_pct = (dt['totalCompleted'] / dt['totalAttempts']).toFixed(2) + "%";
    }

    if(dt['rank']['name'] && dt['rank']['color']){
      var rank = "<p id='rank_p' title='kata difficulty level'>Difficulty: <span id='rank'>" +
      dt['rank']['name'] + "</span></p>";

      $(".modal-body").prepend(rank);
    }

    $("#kataModalLabel").html("<a href='"+ dt['url'] +
    "' target='_blank' title='Link to kata's page on codewars.com'>"+ dt['name']+"</a>");
    $("#kata_pct").text(kata_pct);
    $("#modal-body").text(dt['description']);
    $("#rank, #kata_pct").css("color", kata_map[dt['rank']['color']]);
    hide_loader("#kataModal");
  }

  function clear_kata_modal(){
    $("#kataModalLabel").empty();
    $("#rank_p").remove();
    $("#kata_pct").empty();
    $("#modal-body").empty();
  }

  // fix css for search box and swap with show entries
  function buildChallengeTable(dt, user){
    if(!user){
      user = "SniperWolf421";
    }

    var table = $("#challenge_tbl");

    $("caption").text(user + "'s Completed Kata Challenges");

    table.DataTable({
      data:dt,
      columns: [
        { data: {
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
      dom: '<fl<t>ip>',
      language: {
        search: "Kata Search:"
      },
      order: [[1, 'desc']]
    });
  }
});
