'use strict';
var noteApp = angular.module('myApp.notes', ['ngRoute']);
noteApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/notes', {
    templateUrl: 'notes/notes.html',
    controller: 'NotesController'
  });
}]);
noteApp.service('NotesBackend', function($http) {
  var apiBasePath = 'https://elevennote-nov-2014.herokuapp.com/api/v1/';
  var postNotePath = apiBasePath + 'notes';
  var apiKey = '$2a$10$6vYIy3xC6HPr8p2NdGygzujueCcIR/59jZtgbHTXmS9dJBxwr4bBy';
  var notes = [];
  this.getNotes = function() {
    return notes;
  };
  this.fetchNotes = function() {
    $http.get(apiBasePath + 'notes.json?api_key=' + apiKey).success(function(noteData){
      notes = noteData;
    });
  };
  this.postNote = function(note) {
    $http.post(postNotePath, {
      api_key: apiKey,
      note: {
        title: note.title,
        body_html: note.body_html
      }
    }).success(function(noteData) {
      notes.unshift(noteData);
    });
  };
  this.replaceNote = function(note) {
  for(var i=0; i < notes.length; i++) {
    if (notes[i].id === note.id) {
      notes[i] = note;
      }
    }
  };

  this.updateNote = function(note) {
    var self = this;
    $http.put(apiBasePath + 'notes/' + note.id, {
      api_key: apiKey,
      note: note,
    }).success(function(newNoteData) {
      //self.fetchNotes();
      self.replaceNote(newNoteData);
    })
  };

});
noteApp.controller('NotesController', function($scope, $http, NotesBackend) {
  NotesBackend.fetchNotes();
  $scope.notes = function() {
    return NotesBackend.getNotes();

  };

  $scope.hasNotes = function() {
    return this.notes().length > 0;
  };

  $scope.findNote = function(noteId) {
    var notes = this.notes ();
    for (var i=0; i < notes.length; i++) {
      if (notes[i].id === noteId) {
        return notes[i];
      }
    }
  };

  $scope.cloneNote = function(note) {
    return JSON.parse(JSON.stringify(note));
  };

  $scope.loadNote = function(noteId) {
    $scope.note = JSON.parse(JSON.stringify(this.findNote(noteId)));
  };

  $scope.commit = function() {
    if ($scope.note && $scope.note.id) {
      NotesBackend.updateNote($scope.note);
    } else {
      NotesBackend.postNote($scope.note);
    }
  };

  $scope.clearNote = function() {
    $scope.note = {};
    document.getElementById('note_title').focus();
  };

});
