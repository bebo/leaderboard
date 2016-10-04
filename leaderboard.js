var Leaderboard = {
  TABLE_NAME: "leaderboard",
  SCORE_EVENT: "score_update",
  HIGH_SCORE_EVENT: "highscore_update",
  score: -1,
  onHighScoreFunction: function() {},

  setOnScore: function(cb) {
    Bebo.onEvent(function(data) {
      if (data.type === Leaderboard.SCORE_EVENT) {
        cb(data);
      }
    });
  },

  setOnHighscore: function(cb) {
    Bebo.onEvent(function(data) {
      if (data.type === Leaderboard.HIGH_SCORE_EVENT) {
        cb(data);
      }
    });
    Leaderboard.onHighScoreFunction = cb;
  },

  setScore: function(new_score) {
    Leaderboard.getPersonalScore(function(score) {
      if (new_score > score) {
        Leaderboard.score = new_score;
        var data = { id: Bebo.User.getId(), score: new_score };
        Bebo.Db.save(Leaderboard.TABLE_NAME, data);
        Bebo.emitEvent({ type: Leaderboard.HIGH_SCORE_EVENT, score: new_score, user_id: Bebo.User.getId() });
      }
    });
    Bebo.emitEvent({ type: Leaderboard.SCORE_EVENT, score: new_score, user_id: Bebo.User.getId() });
  },
  getHighScore: function(cb) {
    Leaderboard.getLeaderboard(function(err, data) {
      if (err) {
        cb(err, null);
        return;
      }
      cb(data.result[0], null);
    })
  }
  getPersonalScore: function(cb) {
    if (Leaderboard.score === -1) {
      Bebo.Db.get(Leaderboard.TABLE_NAME, { id: Bebo.User.getId() })
        .then(function(err, resp) {
          if (err) {
            cb(err, null);
          } else if (!resp) {
            Leaderboard.score = 0;
          } else if (!resp.result || resp.result.length === 0) {
            Leaderboard.score = 0;
          } else {
            var row = resp.result[0];
            Leaderboard.score = row.score;
          }
          cb(null, Leaderboard.score);
        })
        .catch(function(err) {
          cb(err, null)
          console.error("failed to fetch scores");
        });
    } else {
      cb(null, Leaderboard.score);
    }
  },
  getLeaderboard: function(cb) {
    Bebo.Db.get(Leaderboard.TABLE_NAME, { sort_by: "score" }, function(err, data) {
      var results = [];
      if (err) {
        cb(err, null)
      }
      if (!err && data.result) {
        results = data.result;
      }
      cb(null, results);
    });
  }
};
