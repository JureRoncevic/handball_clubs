PGDMP                  	    |            handball_clubs    16.1    16.1     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16477    handball_clubs    DATABASE     �   CREATE DATABASE handball_clubs WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Croatian_Croatia.1250';
    DROP DATABASE handball_clubs;
                postgres    false            �            1259    16552    clubs    TABLE     �  CREATE TABLE public.clubs (
    club_id integer NOT NULL,
    club_name character varying(100) NOT NULL,
    country character varying(50) NOT NULL,
    phone_number character varying(20) NOT NULL,
    email character varying(100) NOT NULL,
    year_established integer NOT NULL,
    home_arena character varying(100) NOT NULL,
    league character varying(50) NOT NULL,
    championships_won integer NOT NULL,
    website character varying(100) NOT NULL,
    light_team_color character varying(50) NOT NULL,
    dark_team_color character varying(50) NOT NULL,
    head_coach_first character varying(50) NOT NULL,
    head_coach_last character varying(50) NOT NULL
);
    DROP TABLE public.clubs;
       public         heap    postgres    false            �            1259    16551    clubs_club_id_seq    SEQUENCE     �   CREATE SEQUENCE public.clubs_club_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.clubs_club_id_seq;
       public          postgres    false    216            �           0    0    clubs_club_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.clubs_club_id_seq OWNED BY public.clubs.club_id;
          public          postgres    false    215            �            1259    16561    players    TABLE     >  CREATE TABLE public.players (
    player_id integer NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    "position" character varying(30) NOT NULL,
    jersey_number integer NOT NULL,
    nationality character varying(50) NOT NULL,
    club_id integer NOT NULL
);
    DROP TABLE public.players;
       public         heap    postgres    false            �            1259    16560    players_player_id_seq    SEQUENCE     �   CREATE SEQUENCE public.players_player_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.players_player_id_seq;
       public          postgres    false    218            �           0    0    players_player_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.players_player_id_seq OWNED BY public.players.player_id;
          public          postgres    false    217            U           2604    16555    clubs club_id    DEFAULT     n   ALTER TABLE ONLY public.clubs ALTER COLUMN club_id SET DEFAULT nextval('public.clubs_club_id_seq'::regclass);
 <   ALTER TABLE public.clubs ALTER COLUMN club_id DROP DEFAULT;
       public          postgres    false    216    215    216            V           2604    16564    players player_id    DEFAULT     v   ALTER TABLE ONLY public.players ALTER COLUMN player_id SET DEFAULT nextval('public.players_player_id_seq'::regclass);
 @   ALTER TABLE public.players ALTER COLUMN player_id DROP DEFAULT;
       public          postgres    false    217    218    218            �          0    16552    clubs 
   TABLE DATA           �   COPY public.clubs (club_id, club_name, country, phone_number, email, year_established, home_arena, league, championships_won, website, light_team_color, dark_team_color, head_coach_first, head_coach_last) FROM stdin;
    public          postgres    false    216   X       �          0    16561    players 
   TABLE DATA           t   COPY public.players (player_id, first_name, last_name, "position", jersey_number, nationality, club_id) FROM stdin;
    public          postgres    false    218   H       �           0    0    clubs_club_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.clubs_club_id_seq', 10, true);
          public          postgres    false    215            �           0    0    players_player_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.players_player_id_seq', 84, true);
          public          postgres    false    217            X           2606    16559    clubs clubs_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.clubs
    ADD CONSTRAINT clubs_pkey PRIMARY KEY (club_id);
 :   ALTER TABLE ONLY public.clubs DROP CONSTRAINT clubs_pkey;
       public            postgres    false    216            Z           2606    16566    players players_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_pkey PRIMARY KEY (player_id);
 >   ALTER TABLE ONLY public.players DROP CONSTRAINT players_pkey;
       public            postgres    false    218            [           2606    16567    players players_club_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(club_id);
 F   ALTER TABLE ONLY public.players DROP CONSTRAINT players_club_id_fkey;
       public          postgres    false    216    4696    218            �   �  x�mT�n�F<7�b�	|��M�[��zk�ri�-rDr���Z�=�#r�!�r���4Iyco,ԫ�XSU�.\b��&�ӟ*��"�+R%�.�PL��=�w`W�p(��J;��s�ʱ�I�+�ť!��$c��)�7���`��r+Ӭ��%��ޡ��gmQ�����/�#\����"��#/��#�%[�ȵ��f�x�&�B+�cl�����V���db�D���`�$�}�x+KT� s�&%�n��*&y���4���i�!W�φ��˅�SCX��D&>aA���� �V�L>:�evf���A/�S��P)wdD�!D�狞3�PO�%F��d�����[]�&�ܽ��ln$����x;]7$�]�=��]��C�(�Lbem��]���U��,ź��1m	�߽�.�`t6��Y�1��,^dF֬��9������R�y���/��%�N���˗�z�	��V�4��o�M�,�a��|��������%[<~���ψ]q��{��r������8�I0ׂ#xC��u"N��"�DN�p$��ٶ������d�r�?��qV�,�t�d9�gaF�V%TA|���*g�1��{d�a-��FY�QI�%�[IEL�0,3�����G>�AeWX�n��E_�8��q�LX�[JY }xBzoXF�n��S�'������iB:�J5p���6H{k?P}���s)�X�*E����Z:^��]}���-T�Y��.:cPy�+wT��b�;����G*��xP�5���������B\�,$�����D����
\���q0v=�W��.Ɏ3,+RZֳl��Îu9���3���D�0�G������-9�-VZ�g�_��LAT��
t}�Í�T���#T���Cy�Ě�c3�)�xJ���|�|�(�tk���<��Uujo�����%�����/t�)l8�_q��m~�}�����p�Ց��(nڦ�:Z�ږe���"�      �   �  x�uV���F��_��!Q�D��ʧ}cqZ�'C��q4#9��� ;�}ą8088���\�}h��S���]]���!]�Z��.�.���Ea�5-�P5�-�i�z#lM��?�%�i��4�]U�%l�_���?�kc?�{�Ӆ������}���Z=�G6OH:�[	���觸3QԔ�`�$=xBW�l��ܱ�O�����s���9'=�]���Z�t}'�[�O�q���{���4խ9�{)5�7J܃�$	�	���
�z�X�{�%R���X�.��xƺ2\�X��h�R{|J3%�\�"dk0��2;�RxԐ����l�6��o!eiz9���]�&d)K��+�!`�lPƕ�]����<�ѥ�M<��24�ҸF�Tr���ۺJ(���Sʴ��؉��֘f�A��O�>pevRD0)v ��w�f�@Ӊ5��>��Jni� ��K�����9�]��?���9@���/��2](ae!B��!8��қI��pt2�V� ^���V�wB���!��S1�[c��l[�k+���|�U�x�zN�ʁ�����	U�N�n�fW�͓.��Ն�k��6 ��v�ƯiB�O\BOi7L��⁐��Aڧ%�"����[��BGd�VT.�R��C��#t@�(�FZ:q[aEw�-��h�0B�e�c�.-K��ʺ���c��'8:���K�3�S��pH?��c�(��	'��h�ƴl��~�B4H��+t��S#~�[�+Y��2P�jg1�,f���	↯�c�~��A-@wxCM����9�a4���O�겶`"�i�t+7�����G�س:��d��oYVnәl)�`�g�O��0ٜ��uwi�a5��`�5wt5Q~�)0/�U�Xv	�w�#�ke�B�o�9�h`L-����?�-a�uW]��s�8f4�G�t-V2�l2y���L|aF�ta�ʐ��8�v�����B�Є$vh>`}:7���7ǥ�o��2���؄�*��8��'�CY�:� �r�m����
����^���Bp�Ɖ���� ���%�Yd��+үn
ц4�̈0~D�*��9$	�}�[��o���gXq����{`��� s� 6��h+|}rXt"�4xCSr�Y4�y+����[����Q���*-
i�Nj����:��^|�i���l-�0U|'����K/�^�=���5p���s�Wq��$����\@3+�((L�{�r��e����

$ 4	*�s�D<���3�+�4:FW[^�Ź�-�n! 3,i��������֋��rlW��G��;��4;\e�T�á�����b�����팣Tm�[�ί瀬$���Y���Ĳ֝A?� 	-��\�n�g+8�+�O3ӣ�'=z+�Pޛ�$A�_���?i�n     