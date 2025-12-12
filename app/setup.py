from setuptools import setup, find_packages

requires = [
    'pyramid',
    'waitress',
    'pyramid-tm',
    'pyramid-debugtoolbar',
    'SQLAlchemy',
    'psycopg[binary]',
    'python-dotenv',
    'pydantic',
    'transformers',
    'torch',
    'google-generativeai',
    'requests',
]

setup(
    name='review_analyzer',
    version='1.0.0',
    description='Product Review Analyzer with NLP',
    classifiers=[
        'Programming Language :: Python',
        'Framework :: Pyramid',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Internet :: WWW/HTTP :: WSGI :: Application',
    ],
    author='',
    author_email='',
    url='',
    keywords='web pyramid pylons review analyzer nlp',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=requires,
    entry_points={
        'paste.app_factory': [
            'main = review_analyzer:main',
        ],
    },
)
