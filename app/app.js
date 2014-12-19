'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ngRoute',
  'ngCookies',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'myApp.notes',
  'myApp.login'

]);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/notes'});
}]);

// <a href="" focus-on="">
app.directive('focusOn', function() {
  return function(scope, element, attributes) {
    scope.$on(attributes.focusOn, function () {
      element[0].focus();
    });
  };
});

app.service('NotesBackend', function($http, $cookies) {
  var apiBasePath = 'https://elevennote-nov-2014.herokuapp.com/api/v1/';
  var postNotePath = apiBasePath + 'notes';
  //var user.api_key = '$2a$10$6vYIy3xC6HPr8p2NdGygzujueCcIR/59jZtgbHTXmS9dJBxwr4bBy';
  var notes = [];
  var user =  $cookies.user  ? JSON.parse($cookies.user) : {};

  this.getNotes = function() {
    return notes;
  };

  this.getUser = function() {
    return user;
  };

  this.fetchNotes = function() {
    if (user.api_key !== undefined) {
      $http.get(apiBasePath + 'notes.json?api_key=' + user.api_key).success(function(noteData){
        notes = noteData;
      });
    }
  };

  this.fetchUser = function(user) {
    var self = this;
    $http.post(apiBasePath + 'session', {
      user: {
        username: user.username,
        password: user.password
      }
    }).success(function(userData){
      user = userData;
      $cookies.user = JSON.stringify(user);
      self.fetchNotes();
    });
  };

  this.postNote = function(note) {
    $http.post(postNotePath, {
      api_key: user.api_key,
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
      api_key: user.api_key,
      note: note,
    }).success(function(newNoteData) {
      //self.fetchNotes();
      self.replaceNote(newNoteData);
    });
  };

  this.deleteNote = function(note) {
    var self = this;
    $http.delete(apiBasePath + 'notes/' + note.id +
      '?api_key=' + user.api_key)
    .success(function() {
      self.fetchNotes();
    });
  };

});
