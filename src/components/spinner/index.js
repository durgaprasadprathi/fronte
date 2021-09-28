import LoadingOverlay from 'react-loading-overlay-ts';
import BounceLoader from 'react-spinners/BounceLoader'

const MyLoader = ({ active, children }) => {
    console.log(active)
    return (
        <LoadingOverlay
            active={active}
            spinner={<BounceLoader />}
            text=""
            styles={{position: 'inherit'}}
        >
            {children}
        </LoadingOverlay>
    )
}

export default MyLoader;

