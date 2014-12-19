'use strict';
var noteApp = angular.module('myApp.notes', ['ngRoute']);
noteApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/notes', {
    templateUrl: 'notes/notes.html',
    controller: 'NotesController'
  });
}]);

noteApp.controller('NotesController', function($scope, NotesBackend) {
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
    //document.getElementById('note_title').focus();
    $scope.$broadcast('noteCleared');
  };

  $scope.deleteNote = function () {
    NotesBackend.deleteNote($scope.note);
    this.clearNote();
  };

});
