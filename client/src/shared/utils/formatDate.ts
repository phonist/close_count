const formatDate = function(date:any): any {
  return new Intl.DateTimeFormat().format(new Date(date));
}

export default formatDate;
