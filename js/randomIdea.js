angular.module('AngularApp', [])
  .controller('ideaCtrl', ['$scope', '$http',
    function ($scope, $http) {
      // Setup scope variables to have the buttons disabled until the http get is successful.
      disable();
      $scope.placeholderText = "Loading...";

      // Get the JSON data used to fill the template string.
      var JSONdata = {};
      var attributesUrl = 'https://raw.githubusercontent.com/madodds/Game-Idea-Generator/master/Attributes.json';
      $http.get(attributesUrl)
          .success(function (data) {
            JSONdata = data;
            $scope.getFailed = false;
            $scope.placeholderText = 'Press the Generate Idea button';
          })
          .error(function () {
            disable();
            console.log('Could not read the JSON data from ' + attributesUrl);
          });

      // Randomly create a video game idea.
      $scope.getIdea = function () {
        try {
          var template = 'Create {0} {1} {2} game that utilizes {3}, {4}, and {5}. This game has {6} {7} setting with {8} {9} art style.',
              randomData = [], rNums = [], JDA = JSONdata.attributes;

          // Add 2 Genres
          rNums = getUniqueRandNums(JDA.genres.length, 2);
          randomData.push(checkAn(
              JDA.genres[rNums[0]].an),
              JDA.genres[rNums[0]].genre,
              JDA.genres[rNums[1]].genre);

          // Add 3 Perks
          rNums = getUniqueRandNums(JDA.perks.length, 3);
          randomData.push(
              JDA.perks[rNums[0]].perk,
              JDA.perks[rNums[1]].perk,
              JDA.perks[rNums[2]].perk);

          // Add 1 Setting
          rNums = [rand(JDA.settings.length)];
          randomData.push(checkAn(
              JDA.settings[rNums[0]].an),
              JDA.settings[rNums[0]].setting);

          // Add 1 Style
          rNums = [rand(JDA.styles.length)];
          randomData.push(checkAn(
              JDA.styles[rNums[0]].an),
              JDA.styles[rNums[0]].style);

          // Insert the random data into the template, and save it to the $scope.
          $scope.idea = template.fArray(randomData);

          // Get 1 engine and save its URL to the $scope.
          template = 'Need an engine? Try using {0} to build this game, which uses {1} as its language{2}.';
          rNums = [rand(JDA.engines.length)];
          randomData = [ // The 3rd element of the array defines if 'language' is plural or not.
              JDA.engines[rNums[0]].name,
              JDA.engines[rNums[0]].language,
              JDA.engines[rNums[0]].language.indexOf(" and ") > -1 ? 's' : ''];
          $scope.engineUrl =
              JDA.engines[rNums[0]].url;

          // Insert the engine data into the template, and save it to the $scope.
          $scope.engineInfo = template.fArray(randomData);

          // Clear out the placeholder text now that there's actual data.
          $scope.placeholderText = '';
        }
        catch (err) {
          disable();
          console.log(err);
        }
      }

      // Returns true if the engine URL has not been set yet.
      $scope.noUrl = function () {
        if ($scope.engineUrl == '') return true;
        else return false;
      }

      // Changes the scope variables to a disabled state.
      function disable() {
        $scope.placeholderText = 'Sorry, I\'m Temporarily Unavailable';
        $scope.idea = '';
        $scope.engineInfo = '';
        $scope.engineUrl = '';
        $scope.getFailed = true;
      }
    }]);

// Formats a string. Modified to accept an array of strings. Inspired from:
// https://stackoverflow.com/questions/1038746/equivalent-of-string-format-in-jquery
String.prototype.format = String.prototype.fArray = function () {
  var s = this,
      i = arguments[0].length;

  while (i--) {
    s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[0][i]);
  }
  return s;
}

// Returns an array of random, unique numbers.
function getUniqueRandNums(maxNum, arrayLength) {
  var randNums = [];
  for (var i = 0; i < arrayLength; i++) {
    randNums.push(uniqueRand(maxNum, randNums));
  }
  return randNums;
}

// Returns a random value starting at 0, that is not equal to the ones in the array received.
function uniqueRand(maxNum, numArrayToCompare) {
  var endLoop, randNum, guessAmount = 0, maxGuesses = 15;
  do {
    guessAmount++;
    endLoop = true;
    randNum = rand(maxNum);
    for (var i = 0; i < numArrayToCompare.length; i++) {
      if (numArrayToCompare[i] == randNum) {
        endLoop = false;
        break;
      }
    }
  } while (!endLoop || guessAmount > maxGuesses);
  return randNum;
}

// Returns a random value starting at 0.
function rand(maxNum) {
  return Math.floor(Math.random() * maxNum);
}

// Returns 'an' or 'a' based on if the string received is 'true' or 'false'. For grammar.
function checkAn(anString) {
  return anString == 'true' ? 'an' : 'a';
}
