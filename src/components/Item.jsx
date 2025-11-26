const Item = ({ item, removeItem }) => {
  return (
    <li>
      <div>
        <a href={item.url}>{item.title}</a>
        &nbsp;
        {item.author}
        &nbsp;
        {item.num_comments}
        &nbsp;
        {item.points}
      </div>
      <button onClick={() => removeItem(item)}>Remove</button>
    </li>
  );
};

export default Item;
