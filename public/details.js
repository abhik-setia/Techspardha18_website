var map=new Object();
var category, event;
var count=0;
function categorySelected()
{
    category=$('#dcategory').val();
    console.log(category);
    getEventsByCategory(category);
    $('#devent').text('<option value="null">Choose Event</option>');            
    $('select').material_select();

}
function getEventsByCategory(categoryname)
{
    //Case sensitive
    var eventid;
    event_categories_ref.child(categoryname).once('value', function(snapshot){
        //console.log("Snapshot: ", snapshot.val());
        database.ref(snapshot.val()).once('value', function(event){
            event.forEach(function(name_id_pair){
                var ename=name_id_pair.key;
                console.log(ename);
                $('#devent').append('<option value="'+ename+'">'+ename+'</option>');
                map[name_id_pair.key]=name_id_pair.val();    
                 $('select').material_select();
            });
        }); 
    });
}
function getEventDetails(){
    $('#reg').text('');
    $('#reg_cnt').text('');
    count=0;
    event=$('#devent').val();
    if(event == null || category==null)
        {
            Materialize.toast("Invalid Selection",2000);
            return;
        }
    console.log(event);
    $('#details-btn').addClass('disabled');
    $('#details-btn').text('Please Wait');
    getRegistrantByEventId(map[event]);   
}
function parseRegistrant(object)
{
    count++;
    $('#reg_cnt').text("Number of entries: "+count);
    $('#reg').append('<tr><td>'+count+'</td><td>'+object.name+'</td><td>'+object.original_mail+'</td></tr>');
    console.log("Registrant: ", object);
}
function getRegistrantbyRegKey(reg_key)
{
    var reg_ref=database.ref('registraiton-details/'+reg_key);
    reg_ref.once('value', function(snapshot){
        if(snapshot.val()==null)
        {
            $('#details-btn').removeClass('disabled');
                 $('#details-btn').text('Submit');
            Materialize.toast("No registrants");
        }
        snapshot.forEach(function(id_key_pair){
             var user_or_team_ref=database.ref('registraiton-details/'+id_key_pair.val());
             user_or_team_ref.once('value', function(data){
                 parseRegistrant(data.val());
             }).then(function(){
                 $('#details-btn').removeClass('disabled');
                 $('#details-btn').text('Submit');
             });
        });
    });
}
function getRegistrantByEventId(eventId)
{
    var event_ref=database.ref(eventId);
    event_ref.on('value', function(snapshot){
         var reg_detail_key=snapshot.val().registration_details_key;
         getRegistrantbyRegKey(reg_detail_key);
    });
}