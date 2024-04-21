$('#inputGroupSelect01').change(function () {
    switch ($(this).val()) {
      case 'NULL':
        $('#portnro').css({ 'display': 'inline' });
        $('#protoIP').val("")
        break;
      case 'ICMP':
        $('#portnro').css({ 'display': 'none' });
        $('#protoIP').val("")
        break;
      case 'TCP':
        $('#portnro').css({ 'display': 'inline' });
        break;
      case 'UDP':
        $('#portnro').css({ 'display': 'inline' });
        
        break;
      case 'TCP/UDP':
        $('#portnro').css({ 'display': 'inline' });
        break;
    }
  })

