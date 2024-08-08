interface LogoProps {
    className?: string
    fill?: string
}

const Logo = ({ className, fill }: LogoProps) => {
    return (
        <svg width="96" height="96" viewBox="0 0 96 96" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M48 84C40.75 84 34.6667 77.79 34.6667 70.23C34.6667 63.39 39.75 57.36 46.4167 56.55V55.92C46.4167 51.6 44.5 47.73 37.1667 42.96C29.8333 38.19 28 34.23 28 27.84C28 18.03 35.5 12 48 12C60.5833 12 68 18.03 68 27.84C68 34.32 66.0833 38.46 58.9167 43.14C51.6667 47.91 49.6667 51.96 49.6667 55.92V56.55C56.3333 57.36 61.3333 63.39 61.3333 70.23C61.3333 77.88 55.3333 84 48 84Z" fill="black" />
        </svg>


    )
}

export default Logo