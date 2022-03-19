function formatDate((date:any)) {
  return new Intl.DateTimeFormat().format(new Date(date));
}

export default formatDate;
