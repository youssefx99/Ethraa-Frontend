import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faLocationArrow,
    faPhone,
    faEnvelope,
    faGlobe
} from '@fortawesome/free-solid-svg-icons';

import { faTwitter } from '@fortawesome/free-brands-svg-icons';
export default function Footer() {
    return (
        <>
            <div dir='rtl' className="border-top border-dark border-4 mt-5">
                <footer className="container text-center mt-4">
                    <div className="row">
                        <div className="d-flex align-items-center gap-2 col-md-3 col-lg-3 mb-2">
                            <FontAwesomeIcon icon={faGlobe} size="xl" />
                            <a className="text-decoration-none ms-1 text-dark" href="http://www.ithra.edu.sa/">www.ithra.edu.sa</a>
                        </div>
                        <div className="d-flex align-items-center gap-2 col-md-3 col-lg-2 mb-2">
                            <FontAwesomeIcon icon={faTwitter} size="xl" /> ithra_edu
                        </div>
                        <div className="d-flex align-items-center gap-2 col-md-3 col-lg-2 mb-2">
                            <FontAwesomeIcon icon={faEnvelope} size="xl" /> Info@ithra.edu.sa
                        </div>
                        <div className="d-flex align-items-center gap-2 col-md-3 col-lg-2 mb-2">
                            <FontAwesomeIcon icon={faPhone} size="xl" /> 920022952
                        </div>
                        <div className="d-flex align-items-center gap-2 col-12 col-lg-3 mb-2">
                            <FontAwesomeIcon icon={faLocationArrow} size="xl" /> P.O. Box: 70234 Khobar 31952 Saudi Arabia
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}