export const Palette = (
    {
        colors,
        title
    } : {
        colors: string[],
        title: string
    }
) => {
    return (
        <div>
            <h2>{title}</h2>
            <div className={"palette"}>
                {
                    colors.map((color, index) => {
                        return(
                            <div key={index} style={{backgroundColor: color, width: "50px", height: "50px"}}>{color}</div>
                        );
                    } )
                }
            </div>
        </div>
    );
};

export default Palette;