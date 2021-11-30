$(document).ready(function(){

  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const d = new Date();
  let day = days[ d.getDay() ].toUpperCase();
  let month = months[ d.getMonth() ];
  let date = d.getDate();
  $('.date').append(`<h6 class="my-0"><b>${day}, </b>${month} ${date}</h6>`);

  var getAndDisplayAllTasks = function () {
    $.ajax({
      type: 'GET',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=212',
      dataType: 'json',
      success: function (response, textStatus) {
        $('#todo-list').empty();
        
        var returnActiveTasks = response.tasks.filter(function (task) {
          if (!task.completed) {
            return task.id;
          }
        });

        var returnCompletedTasks = response.tasks.filter(function (task) {
          if (task.completed) {
            return task.id;
          }
        });
  
        var filter = $('.active').attr('id');
  
        if (filter === 'all' || filter === '') {
          taskItems = response.tasks;
        }
        if (filter === 'active') {
          taskItems = returnActiveTasks;
        }
        if (filter === 'completed') {
          taskItems = returnCompletedTasks;
        }

        var sortedItems = taskItems.sort(function (a, b) {
          return Date.parse(a.created_at) - Date.parse(b.created_at);
        });

        sortedItems.forEach(function (task) {
          $('#todo-list').append(`
            <div class="task">
              <div class="custom-control custom-checkbox ml-3">
                <input type="checkbox" class="custom-control-input mark-complete" id="customCheck${task.id}" data-id="${task.id}" ${task.completed ? 'checked' : ''} />
                <label class="custom-control-label" for="customCheck${task.id}"></label>
              </div>
              <p class="task-content ${task.completed ? 'crossed-out' : ''}">${task.content}</p>
              <button class="btn delete-button px-3" data-id="${task.id}"><i class="far fa-trash-alt"></i></button>
            </div>
          `);
        })

        //<input type="checkbox" class="mark-complete ml-3" data-id="${task.id}" ${task.completed ? 'checked' : ''}>

        $('.to-do-amount span').text(returnActiveTasks.length);
      },

      
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }



  var createTask = function () {
    $.ajax({
      type: 'POST',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=212',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        task: {
          content: $('.add-input').val()
        }
      }),
      success: function (response, textStatus) {
        $('.add-input').val('');
        getAndDisplayAllTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });  
  }

  $('#create-task').on('submit', function (e) {
    e.preventDefault();
    createTask();
  });

  var deleteTask = function (id) {
    $.ajax({
      type: 'DELETE',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '?api_key=212',
      success: function (response, textStatus) {
        getAndDisplayAllTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }

  $(document).on('click', '.delete-button', function () {
    deleteTask($(this).data('id'))
  });

  var markTaskComplete = function (id) {
    $.ajax({
      type: 'PUT',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '/mark_complete?api_key=212',
      dataType: 'json',
      success: function (response, textStatus) {
        getAndDisplayAllTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }

   var markTaskActive = function (id) {
    $.ajax({
      type: 'PUT',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '/mark_active?api_key=212',
      dataType: 'json',
      success: function (response, textStatus) {
        getAndDisplayAllTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }

  $(document).on('change', '.mark-complete', function () {
    if (this.checked) {
       markTaskComplete($(this).data('id'));
     } else {
       markTaskActive($(this).data('id'));
     }
   });

   // filtering
  $('.to-do-filter button').on('click', function() {
    $(this).addClass('active');
    $(this).siblings().removeClass('active');
    getAndDisplayAllTasks();
  });

  getAndDisplayAllTasks();

});