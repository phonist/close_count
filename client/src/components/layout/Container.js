const Container = ({children}) => {

    const container = {
        transform: `translate(135%,-50%)`
    }
    
    return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={container}>
            <div className="max-w-sm w-96">{children}</div>
        </div>
    );
};

export default Container;
