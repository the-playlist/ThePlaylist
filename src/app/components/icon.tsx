const Icon = (props: any) => {
  return (
    <i style={props.style} className={`${props.icon} ${props.className}`} />
  );
};

export default Icon;
