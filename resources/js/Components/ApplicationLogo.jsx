export default function ApplicationLogo(props) {
    return (
        <img 
            {...props} 
            src="/favicon.svg" 
            alt="Logo Aplikasi" 
            // Default styling agar tidak pecah saat props kosong
            className={`w-20 h-20 object-contain ${props.className || ''}`} 
        />
    );
}