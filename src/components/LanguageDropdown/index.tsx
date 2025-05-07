import {useMemo} from 'react';
import {Link} from 'react-router-dom';
import {Dropdown} from 'react-bootstrap';
import {useToggle} from '@/hooks';
import {useTranslation} from 'react-i18next';
import enFlag from './flags/us.jpg';
import esFlag from './flags/spain.jpg';

type Language = {
  name: string;
  flag: string;
  value: string;
};

const Languages: Language[] = [
  {
    name: 'language.spanish',
    value: 'es',
    flag: esFlag
  },
  {
    name: 'language.english',
    value: 'en',
    flag: enFlag
  }
];

const LanguageDropdown = () => {
  const {i18n, t} = useTranslation();
  const [isOpen, toggleDropdown] = useToggle();
  const currentLanguage: Language = useMemo(() => {
    return Languages.find((lang) => lang.value === i18n.language) || Languages[0];
  }, [i18n.language]);

  return (
    <Dropdown show={isOpen} onToggle={toggleDropdown}>
      <Dropdown.Toggle
        variant="link"
        id="dropdown-languages"
        onClick={toggleDropdown}
        className="nav-link dropdown-toggle arrow-none">
        <img src={currentLanguage.flag} alt={t(currentLanguage.name)} className="me-0 me-sm-1" height="12" />
        <span className="align-middle d-none d-sm-inline-block">{t(currentLanguage.name)}</span>
        <i className="mdi mdi-chevron-down d-none d-sm-inline-block align-middle" />
      </Dropdown.Toggle>
      <Dropdown.Menu align={'end'} className="dropdown-menu-animated topbar-dropdown-menu">
        <div onClick={toggleDropdown}>
          {Languages.map((lang, i) => {
            return (
              <Link
                to=""
                className="dropdown-item notify-item"
                key={i + '-lang'}
                onClick={() => i18n.changeLanguage(lang.value)}>
                <img src={lang.flag} alt={t(lang.name)} className="me-1" height="12" />
                <span className="align-middle">{t(lang.name)}</span>
              </Link>
            );
          })}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageDropdown;
